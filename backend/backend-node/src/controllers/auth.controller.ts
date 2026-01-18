import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { generateToken } from '../utils/jwt.js';
import { UserType } from '../generated/prisma//index.js';
import logger from '../utils/logger.js';

export const register = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      userType,
      locationName,
      locationMainStreet,
      locationSecondaryStreet,
      locationReference,
      locationCityCode
    } = req.body;

    logger.info('User registration attempt', { email, userType });

    // Validations
    if (password !== confirmPassword) {
      logger.warn('Registration failed: Passwords do not match', { email });
      return sendError(res, 'Passwords do not match', null, 400);
    }

    if (!Object.values(UserType).includes(userType)) {
      logger.warn('Registration failed: Invalid user type', { email, userType });
      return sendError(res, 'Invalid user type', null, 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      logger.warn('Registration failed: Email already exists', { email });
      return sendError(res, 'Email already registered', null, 400);
    }

    // Validate location fields
    if (!locationName || !locationMainStreet || !locationSecondaryStreet || !locationReference || !locationCityCode) {
      logger.warn('Registration failed: Missing location fields', { email });
      return sendError(res, 'All location fields are required', null, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    logger.database('CREATE', 'User', { email, userType });

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        userType,
        ...(userType === UserType.DONOR && {
          donor: {
            create: {
              locations: {
                create: {
                  name: locationName,
                  mainStreet: locationMainStreet,
                  secondaryStreet: locationSecondaryStreet,
                  reference: locationReference,
                  cityCode: locationCityCode
                }
              }
            }
          }
        }),
        ...(userType === UserType.BENEFICIARY && {
          beneficiary: {
            create: {
              foundation: {
                create: {
                  name: locationName,
                  mainStreet: locationMainStreet,
                  secondaryStreet: locationSecondaryStreet,
                  reference: locationReference,
                  cityCode: locationCityCode
                }
              }
            }
          }
        })
      },
      include: {
        donor: {
          include: {
            locations: true
          }
        },
        beneficiary: {
          include: {
            foundation: true
          }
        }
      }
    });

    logger.auth('User registered successfully', user.id, {
      email: user.email,
      userType: user.userType,
      city: locationCityCode
    });

    const token = generateToken(user.id, user.userType);
    const { password: _, ...userWithoutPassword } = user;

    return sendSuccess(res, 'User registered successfully', {
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    logger.error('Registration error', error);
    return sendError(res, 'Failed to register user', error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    logger.info('Login attempt', { email });

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        donor: {
          include: {
            locations: true
          }
        },
        beneficiary: {
          include: {
            foundation: true
          }
        }
      }
    });

    if (!user) {
      logger.warn('Login failed: User not found', { email });
      return sendError(res, 'Invalid credentials', null, 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password.replace('$2y$', '$2b$'));

    if (!isPasswordValid) {
      logger.warn('Login failed: Invalid password', { email });
      return sendError(res, 'Invalid credentials', null, 401);
    }

    logger.auth('User logged in successfully', user.id, {
      email: user.email,
      userType: user.userType
    });

    const token = generateToken(user.id, user.userType);
    const { password: _, ...userWithoutPassword } = user;

    return sendSuccess(res, 'Login successful', {
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    logger.error('Login error', error);
    return sendError(res, 'Failed to login', error);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    logger.auth('User logged out', userId);

    return sendSuccess(res, 'Logout successful');
  } catch (error) {
    logger.error('Logout error', error);
    return sendError(res, 'Failed to logout', error);
  }
};
