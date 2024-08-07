import { useNavigate } from "react-router-dom";

// components
import Header from "../../components/Header/Header";

// icons
import { IoIosArrowBack } from "react-icons/io";

const AccountDetails = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    console.log("form");
  };

  return (
    <>
      <Header page={"Account details"} />

      <div className="centerer">
        <label className="back-btn" onClick={() => navigate(-1)}>
          <IoIosArrowBack /> Back
        </label>

        <div className="form-page new-profile">
          <h1>Update your account details</h1>

          <form
            onSubmit={handleSubmit}
            id="updateAccount"
            className="account-details-form new-profile-form"
          >
            <div className="big-group">
              <div className="form-group">
                <label htmlFor="name">Complete Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-group">
                <label htmlFor="first">First Name</label>
                <input
                  id="first"
                  type="text"
                  placeholder="John"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-group">
                <label htmlFor="last">Last Name</label>
                <input
                  id="last"
                  type="text"
                  placeholder="Doe"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-group">
                <label htmlFor="last">Email</label>
                <input
                  id="last"
                  type="email"
                  placeholder="doe@me.com"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-group">
                <label htmlFor="date">Date of entry</label>
                <input
                  id="date"
                  type="text"
                  placeholder="02/12/2023 (day/month/year)"
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            <div className="big-group">
              <div className="form-group">
                <label htmlFor="phone">Mobile phone number</label>
                <input
                  id="state"
                  type="text"
                  placeholder="+1 555 555 5555"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  id="country"
                  type="text"
                  placeholder="United States"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="big-group">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    id="city"
                    type="text"
                    placeholder="New York City"
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="street">Address</label>
                  <input
                    id="state"
                    type="text"
                    placeholder="Put Address here"
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select className="select select-bordered w-full">
                  <option>Decline to answer</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
            </div>
            <div className="btns">
              {/* <button className="btn btn-outline w-full">add new question</button> */}
              <button className="btn  w-full">Update your account</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AccountDetails;
