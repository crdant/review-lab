export function apiError(res: Response, status: number, code: string) {
  return res.status(status).json({ error: { code } });
}