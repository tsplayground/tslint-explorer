export class UUID {

  public static newUUID(): string {
    return this.generateUUID();
  }

  private static generateUUID(): string {
    return this.generatePart() + this.generatePart() + '-' + this.generatePart() + '-' + this.generatePart() + '-' +
      this.generatePart() + '-' + this.generatePart() + this.generatePart() + this.generatePart();
  }

  private static generatePart(): string {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
}
