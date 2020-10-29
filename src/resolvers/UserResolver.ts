import { compare, hash } from "bcryptjs";
import { createAccessToken, createRefreshToken, sendRefreshToken } from "../utils/TokenUtils";
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import {User} from "../entity/User";
import { ServerContext } from "src/ServerContext";

@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string

    @Field(() => User)
    user: User
}

@Resolver()
export class UserResolver {

    @Query(() => [User])
    async users() {
        return User.find()
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() {res}: ServerContext
    ): Promise<LoginResponse> {
        
        const user = await User.findOne({where: {email}});
        
        if(!user) {
            throw new Error("User does not exist")
        }

        const validPassword = await compare(password, user.password);

        if (!validPassword) {
            throw new Error("Wrong Password!")
        }

        sendRefreshToken(res, createRefreshToken(user))
        return {
            accessToken: createAccessToken(user),
            user
        }
    }

    @Mutation(() => Boolean)
    async register(
        @Arg("email") email: string,
        @Arg("password") password: string
    ) {
        const hashedPassword = await hash(password, 12);

        try {
            await User.insert({
                email,
                password: hashedPassword
            })
            
        } catch (error) {
            console.error(error)
            return false
        }
        return true
    }
}