export function sortByFavoritedAndName<T>(
    array: { name: string; favorited: boolean }[]
): T[] {
    return array.sort((a, b) => {
        if (a.favorited === b.favorited) {
            return a.name.localeCompare(b.name);
        }
        return a.favorited ? -1 : 1;
    }) as T[];
}
