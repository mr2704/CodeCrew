export const getAvatarUrl = (
    avatar?: string,
    name?: string
): string => {
    return avatar?.trim()
        ? avatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name || "User"
        )}&background=7c3aed&color=ffffff`;
};