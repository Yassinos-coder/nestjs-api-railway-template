import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import * as bcrypt from 'bcryptjs';
import { DemoService } from './demo.service';

describe('DemoService', () => {
  const serverTime = new Date('2026-01-01T00:00:00.000Z');
  const demoRepository = { getServerTime: async () => serverTime };
  const service = new DemoService(demoRepository as never);

  it('returns the database time as an ISO string', async () => {
    assert.deepEqual(await service.getDatabaseTime(), { serverTime: serverTime.toISOString() });
  });

  it('echoes a note with a timestamp', () => {
    const note = service.createNote({ title: 'Hello', content: 'World' });

    assert.equal(note.title, 'Hello');
    assert.equal(note.content, 'World');
    assert.ok(!Number.isNaN(Date.parse(note.receivedAt)));
  });

  it('hashes a password without storing it in plain text', async () => {
    const result = await service.hashPassword({ password: 'correct-horse' });

    assert.notEqual(result.hash, 'correct-horse');
    assert.equal(result.matches, true);
    assert.equal(await bcrypt.compare('correct-horse', result.hash), true);
  });
});
