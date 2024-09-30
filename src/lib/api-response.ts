class ApiResponse {
  public data: any;
  public success: boolean;
  public message: string;

  public constructor(data: any, message = "Success") {
    this.data = data;
    this.message = message;
    this.success = true;
  }
}

export { ApiResponse };
