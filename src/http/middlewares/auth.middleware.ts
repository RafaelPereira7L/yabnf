export default function Authenticate(target, key, desc) {
  const method = desc.value;
  desc.value = async function (request, reply) {
    try {
      await request.jwtVerify();
      return method.call(this, request, reply);
    } catch (error) {
      reply.status(401).send({
        statusCode: 401,
        error: "Unauthorized",
        message: "Unauthorized",
      });
    }
  };
  return desc;
}