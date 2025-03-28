export default class UserAccountModel {
	constructor(data) {
		this.LoggedInUserID = data.LoggedInUserID;
		this.FullName = data.FullName;
		this.LoggedInUserNameTC = data.LoggedInUserNameTC;
		this.LoggedInUserProfilePic = data.LoggedInUserProfilePic;
		this.LoggedInUserTypeID = data.LoggedInUserTypeID;
		this.Token = data.Token;
		this.EmployeeID = data.EmployeeID;
		this.Designation = data.Designation;
		this.UserId = data.UserId;	
		this.ShowRevenueRelatedData = data.ShowRevenueRelatedData
	}
}
