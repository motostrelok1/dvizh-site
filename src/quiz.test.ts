import { describe, expect, it } from 'vitest';
import { questions, canContinue } from './quiz';
describe('quiz flow',()=>{it('has five observed questions',()=>expect(questions).toHaveLength(5));it('requires an answer',()=>{expect(canContinue()).toBe(false);expect(canContinue('')).toBe(false);expect(canContinue('Онлайн')).toBe(true)});it('has unique ids',()=>expect(new Set(questions.map(x=>x.id)).size).toBe(questions.length))});
