export default class UserAccountModel{
    constructor(data){
        this.FullName=data.FullName;
        this.LoggedInUserNameTC=data.LoggedInUserNameTC;
        this.LoggedInUserProfilePic=data.LoggedInUserProfilePic;
        this.LoggedInUserTypeID=data.LoggedInUserTypeID;
        this.Token=data.Token;
    }
}