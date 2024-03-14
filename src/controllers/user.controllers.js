import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation  not empty wrong email etc
  // check if already exists : username,email
  // check for images,check for avatar
  // upload them to cloudinary,avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  //check for user creation
  // return response

  // taking user details from frontend
  const { fullname, email, username, password } = req.body;
  console.log("email :", email);
  console.log("Password : ", password);

  // checking Validation

  // begineer validation
  // if (fullname === "") {
  //   throw new ApiError(400, "fullname is required");
  // }


  // advance validation
  if (
    [fullname,email,username,password].some((field)=>field?.trim()==="")
  ) {
    throw new ApiError(400,"All fields are required")
  }

  const existedUser=User.findOne({
    // here checking in database that user already exists or not by username or email $or is an or operation
    $or:[{username},{email}]
  })

  if (existedUser) {
    throw new ApiError(409,"User with email or username already exists")
  }

  const avatarLocalPath=req.files?.avatar[0]?.path
  const coverImageLocalPath=req.files?.coverimage[0]?.path

  // checking whether avatar is there or not
  if (!avatarLocalPath) {
    throw new ApiError(400,"Avatar file is required")
  }

  // this image uploading will take time so we will use await here
  const avatar=await uploadOnCloudinary(avatarLocalPath)
  const coverImage=await uploadOnCloudinary(coverImageLocalPath)

  if (!avatar) {
    throw new ApiError(400,"Avatar file is required")
  }

  const user=await User.create({
    fullname,
    avatar:avatar.url,
    coverImage:coverImage?.url  || "",
    email,
    password,
    username:username.tolowerCase()
  })

  // removing the password refreshToken  after successfull profile creation
  const createdUser=await User.findById(user._id).select(
    // little weired syntax
    "-password -refreshToken"
  )

  if (!createdUser) {
    throw new ApiError(500,"Something went wrong while registering a user")
  }

  return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered Successfully")
  )


});

export { registerUser };
