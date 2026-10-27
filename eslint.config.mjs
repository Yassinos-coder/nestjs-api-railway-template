import tseslint from 'typescript-eslint';
import security from 'eslint-plugin-security';

export default tseslint.config(
  { ignores: ['dist', '.test-dist', 'node_modules'] },
  ...tseslint.configs.recommended,
  security.configs.recommended,
);
