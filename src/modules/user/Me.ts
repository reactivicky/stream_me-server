import { MyContext } from "./../../types/MyContext"
import { User } from "./../../entity/User"
import { Authorized, Ctx, Query, Resolver } from "type-graphql"

@Resolver()
export default class MeResolver {
  @Authorized()
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    if (!ctx.req.session!.userId) return undefined
    return User.findOne({ where: { id: ctx.req.session!.userId } })
  }
}
