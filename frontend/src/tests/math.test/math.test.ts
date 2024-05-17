import { describe, it, expect } from 'vitest';
import { add, subtract, multiply, divide } from './math';

describe('Math Functions', () => { 

    it('should add two numbers', () => {
        expect(add(1, 2)).toBe(3);
        expect(add(0, 0)).toBe(0);
        expect(add(-1, -1)).toBe(-2);
    });

    it('subtracts two numbers', () => {
        expect(subtract(2, 1)).toBe(1);
        expect(subtract(-1, -1)).toBe(0);
      });
    
      it('multiplies two numbers', () => {
        expect(multiply(2, 3)).toBe(6);
        expect(multiply(-2, -3)).toBe(6);
      });
    
      it('divides two numbers', () => {
        expect(divide(6, 3)).toBe(2);
        expect(divide(6, -3)).toBe(-2);
      });
    
      it('throws an error when dividing by zero', () => {
        expect(() => divide(1, 0)).toThrow('Division by zero');
      });

 })