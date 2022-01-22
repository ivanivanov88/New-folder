// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}
export class Wallet{
  constructor(id,name,href) {
    this.id = id;
    this.name = name;
    this.href= href;
  }
}