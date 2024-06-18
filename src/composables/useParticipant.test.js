import {expect, test, describe} from 'vitest';
import {useParticipant} from './useParticipant';

describe('useParticipant', () => {
	describe('getUserAvatarInitials', () => {
		const {getUserAvatarInitialsFromName} = useParticipant();
		test('Two names', () => {
			expect(getUserAvatarInitialsFromName('Charlotte Reynolds')).toBe('CR');
		});

		test('Three names with dash', () => {
			expect(getUserAvatarInitialsFromName('Nama Sampan-Nirmal Lengkap')).toBe(
				'NSL',
			);
		});

		test('Three names', () => {
			expect(getUserAvatarInitialsFromName('Theresa Jessie Franklin')).toBe(
				'TJF',
			);
		});

		test('Four names (max 3 initials)', () => {
			expect(
				getUserAvatarInitialsFromName('Theresa Jessie Franklin Jasmin'),
			).toBe('TJF');
		});
	});
});
