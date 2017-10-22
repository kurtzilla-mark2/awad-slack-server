const createResolver = (resolver) => {
  const baseResolver = resolver;
  baseResolver.createResolver = (childResolver) => {
    const newResolver = async (parent, args, context, info) => {
      await resolver(parent, args, context, info);
      return childResolver(parent, args, context, info);
    };
    return createResolver(newResolver);
  };
  return baseResolver;
};

export const requiresAuth = createResolver((parent, args, { user }) => {
  if (!user || !user.id) {
    throw new Error('Authentication is required');
  }
});

export const requiresAdmin = requiresAuth.createResolver((parent, args, context) => {
  if (!context.user.isAdmin) {
    throw new Error('Requires Admin access');
  }
});

// an example of how we could keep going down this route of chaining resolvers
// export const bannedUsernameCheck = requiresAdmin.createResolver((parent, args, context) => {
//   if (indexOf(['bob', 'name', 'list'], context.user.username) > -1) {
//     throw new Error('That user is not allowed');
//   }
// });
