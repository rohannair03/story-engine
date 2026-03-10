module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }]
  ],
  plugins: [
    function transformImportMeta() {
      return {
        visitor: {
          MetaProperty(path) {
            path.replaceWithSourceString(
              JSON.stringify({ env: { VITE_ANTHROPIC_API_KEY: 'test-api-key' } })
            );
          }
        }
      };
    }
  ]
};