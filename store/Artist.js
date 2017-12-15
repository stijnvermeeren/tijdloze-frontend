
export default class Artist {
  constructor(artistData) {
    this.id = artistData.id;
    this.firstName = artistData.firstName;
    this.name = artistData.name;
    this.countryId = artistData.countryId;
    this.fullName = this.firstName ? `${this.firstName} ${this.name}` : this.name
  }
}
