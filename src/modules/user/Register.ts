import { RegisterInput } from "./register/RegisterInput"
import { User } from "./../../entity/User"
import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql"
import bcrypt from "bcryptjs"

@Resolver()
export default class RegisterResolver {
  @Authorized()
  @Query(() => String)
  async hello() {
    return "hello world"
  }

  @Mutation(() => User)
  async register(
    @Arg("data") { email, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12)

    const user = User.create({ email, password: hashedPassword }).save()

    return user
  }
}
