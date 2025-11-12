import { NextRequest, NextResponse } from 'next/server'
import { ResponseModel } from '@/lib/model/Response'
import { GetUserById} from '@/app/api/user/service/user_service'
/** * @swagger
 * /api/user/user/detail:
 *   get:
 *     summary: Read User by ID
 *     description: Retrieve a specific user entry by its ID from the database
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "200"
 *                 message:
 *                   type: string
 *                   example: User found
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "404"
 *                 message:
 *                   type: string
 *                   example: User not found
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "500"
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 data:
 *                   type: object
 */

export async function GET(req: NextRequest) {
    try {
        const cookie = await req.cookies;
        const userId = cookie._headers.get('x-user-id');
        const user = await GetUserById(userId);

        if (!user) {
            (ResponseModel as any).status = '404';
            (ResponseModel as any).message = 'User not found';
            (ResponseModel as any).data = null;
            return NextResponse.json(ResponseModel, { status: 404 });
        }

        (ResponseModel as any).status = '200';
        (ResponseModel as any).message = 'Success';
        (ResponseModel as any).data = user;

        return NextResponse.json(ResponseModel, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching user:', error);

        (ResponseModel as any).status = '500';
        (ResponseModel as any).message = 'Internal server error';
        (ResponseModel as any).data = null;

        return NextResponse.json(ResponseModel, { status: 500 });
    }
}