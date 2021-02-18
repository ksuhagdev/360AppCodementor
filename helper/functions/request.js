import Axios from '../../utils/axios-plugin';

export default async function request({ url, config }) {
  const body = (config && config.body) || null;
  const configObj = {
    url,
    method: config.method ? config.method.toLowerCase() : 'get',
  };

  if (body) {
    if (config.method && config.method.toLocaleLowerCase() !== 'get') {
      configObj.data = body;
    }
  }

  console.log("Config Body",config)

  return Axios(configObj);
}
