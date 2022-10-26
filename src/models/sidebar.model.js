export default class SideBarModels {
	constructor(data) {
		this.id = data.id;
		this.title = data.title;
		this.isActive = data.isActive;
		this.icon = data.icon;
		this.navigateTo = data.navigateTo;
	}
}
