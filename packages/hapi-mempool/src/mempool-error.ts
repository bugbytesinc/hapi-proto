export class MempoolError extends Error {
  public readonly title: string;
  public readonly status: number;
  public readonly traceId: string;

  static async create(response: Response): Promise<MempoolError> {
    const problemDetails = await response.json();
    return new MempoolError(problemDetails);
  }

  private constructor(problemDetails: any) {
    super(problemDetails["detail"] || "Unknown Error");
    this.title = problemDetails["title"] || "Unknown Error";
    this.status = problemDetails["status"] || 500;
    this.traceId = problemDetails["traceId"];
  }
}
