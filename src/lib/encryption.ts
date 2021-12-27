import crypto from 'crypto'

export default (value: any) => {
    return crypto.createHash("sha256").update(value).digest("hex");
  };
  
  