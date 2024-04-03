function isUserLoggedIn() {
  return true;
}

export async function getCurrentUser() {
  if (isUserLoggedIn()) {
    return {
      id: 1,
      username: null,
      passwordHash: null,
      emailAddress: null,
      hasPaid: false,
    };
  } else {
    return await prisma.user.create({
      data: {
        username: null,
        passwordHash: null,
        emailAddress: null,
        hasPaid: false,
      },
    });
  }
}
