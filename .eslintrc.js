module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:promise/recommended',
    ],
    parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
    },
    rules: {
        // Ajoutez vos règles personnalisées ici
        'import/prefer-default-export': 'off',
        'no-console': 'warn',
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
    settings: {
        'import/resolver': {
            typescript: {
                project: './tsconfig.json',},
        },
    },
};