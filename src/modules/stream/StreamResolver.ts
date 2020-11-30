import { StreamInput } from "./utils/StreamInput"
import { MyContext } from "./../../types/MyContext"
import { Stream } from "./../../entity/Stream"
import { User } from "./../../entity/User"
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql"

@Resolver(() => Stream)
export default class StreamResolver {
  @Authorized()
  @Query(() => Stream, { nullable: true })
  async stream(@Arg("streamId") streamId: number) {
    return Stream.findOne({ where: { id: streamId } })
  }

  @Authorized()
  @Query(() => [Stream])
  async streams(@Ctx() ctx: MyContext): Promise<Stream[] | null> {
    if (!ctx.req.session!.userId) return null
    return Stream.find({ where: { user: ctx.req.session!.userId } })
  }

  @Authorized()
  @Mutation(() => Stream)
  async addStream(
    @Arg("data") { title, description, url }: StreamInput,
    @Ctx() ctx: MyContext
  ): Promise<Stream> {
    const stream = Stream.create({
      title,
      description,
      url,
      user: ctx.req.session.userId,
    }).save()

    return stream
  }
}
