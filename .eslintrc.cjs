module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        "brace-style": ["warn", "1tbs", { allowSingleLine: true }],
        "camelcase": "warn",
        "comma-dangle": ["warn", "always-multiline"],
        "indent": ["warn", 4, { SwitchCase: 1 }],
        "quotes": ["warn", "double", { avoidEscape: true }],
        "semi": "warn",
        "@typescript-eslint/no-unused-vars": ["warn", {
            args: "all",
            varsIgnorePattern: "^_",
            argsIgnorePattern: "^_",
            caughtErrors: "all",
            caughtErrorsIgnorePattern: "^_",
            ignoreRestSiblings: true,
        }],
    },
};
