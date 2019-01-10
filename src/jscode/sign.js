import CryptoJS from 'crypto-js'

// js封装
export default
  class Sign {
  signCtx(data) {
    this.params = {
      path: data.path,
      token: data.token || '1',
      method: data.method,
      timestamp: data.timestamp,
      query: data.method === 'GET' || data.method === 'DELETE' ? data.data : '',
      body: data.method === 'POST' || data.method === 'PUT' ? data.data : undefined,
      config: data.config,
    };
    const key = {
      method: this.params.method,
      token: this.params.token,
      query: this.params.query,
      body: this.params.body,
    };
    const sign = Sign.signature(this.params.path, this.params.timestamp, key, this.params.config);
    return {
      'ice-auth-appkey': this.params.config.appkey,
      'ice-auth-timestamp': this.params.timestamp,
      'ice-auth-token': this.params.token,
      'ice-auth-sign': sign,
      token: this.params.token,
    };
  }

  /*
  * akmg签名算法
  * @param path 访问路径
  * @param timestamp 时间戳
  * @param params 访问参数（method、token、query、body）
  * @param keyParams 密钥参数（appkey、secretkey）
  * @returns sign 签名值
  */
  static signature(path, timestamp, params, keyParams) {
    if (!path || !timestamp || !keyParams.appkey || !keyParams.secretkey) {
      throw Error('lack necessary parameters');
    }
    const method = params.method || 'GET';
    const token = params.token || '';
    const query = params.query || {};
    const body = params.body;
    // 拼接header头
    const header = 'ice-auth-appkey:' + keyParams.appkey + 'ice-auth-timestamp:' + timestamp + 'ice-auth-token:' + token;
    // 拼接body
    if (body !== undefined) {
      query.json = JSON.stringify(body);
    }
    // 拼接queryString
    let paratmer = '';
    let lwQuery = {};
    Object.keys(query).forEach(key => {
      lwQuery[key.toLocaleLowerCase()] = query[key];
    })
    let sort = Object.keys(lwQuery).sort();
    const querySort = {};
    for (let i = 0; i < sort.length; i++) {
      querySort[sort[i]] = lwQuery[sort[i]];
    }
    for (const key in querySort) {
      paratmer += key + '=' + querySort[key];
    }
    // 拼接所有字符进行urlencode和sha256
    const $string = method + path + header + paratmer + keyParams.secretkey;
    let $formattedStr = $string.replace(/\ +/g, "").replace(/[ ]/g, "").replace(/[\r\n]/g, "");
    const urlCodeStr = encodeURIComponent($formattedStr);
    const sha256 = CryptoJS.SHA256(urlCodeStr);
    return sha256.toString();
  }
}
