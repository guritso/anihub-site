import fs from 'fs';
import path from 'path';

/**
 * @param {string} directory - The directory to map the routes from.
 * @param {string} basePath - The base path to use for the routes.
 * @returns {Promise<Array>} - A promise that resolves to an array of route objects.
 */
const routeMapper = async (directory, basePath) => {
  const routeMap = [];
  const dirVersions = fs.readdirSync(directory);

  for (const dir of dirVersions) {
    const dirPath = path.join(directory, dir);
    const files = fs
      .readdirSync(dirPath)
      .filter((file) => file.endsWith('.js'));

    for (const route of files) {
      const routeFile = await import(path.join(dirPath, route)).then(module => module.default);

      const params = routeFile.data.params || '';

      const routePath = path.join(
        routeFile.data.base ? "/" : basePath || dir,
        route.replace('.js', ''),
        params,
      );

      routeMap.push({
        ...routeFile,
        data: { ...routeFile.data, path: routePath }
      });

      if (routeFile.data.isWildcard) {
        routeMap.push({
          ...routeFile,
          data: { ...routeFile.data, path: path.join(routePath, '/*') }
        });
      }
    }
  }

  return routeMap;
};

export default routeMapper;
