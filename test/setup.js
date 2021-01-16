const { expect } = require('chai');
const supertest = require('supertest');

global.export = expect;
global.supertest = supertest;
