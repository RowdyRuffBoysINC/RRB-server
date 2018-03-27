'use strict';
import { router, } from './router';
import { localStrategy, jwtStrategy, } from './strategies';

module.exports = { router, localStrategy, jwtStrategy, };
