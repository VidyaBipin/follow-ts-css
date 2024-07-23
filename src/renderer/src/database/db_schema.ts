export const dbSchemaV1 = {
  entries: "&id",
  feeds: "&id",
  subscriptions: "&id",
  entryRelated: "&id",
  feedUnreads: "&id",
}

export const dbSchemaV2 = {
  ...dbSchemaV1,
  subscriptions: "&id, userId, feedId",
}

export const dbSchemaV3 = {
  ...dbSchemaV2,
  feedEntries: null,

  subscriptions: "&id, userId, &feedId",
}

export const dbSchemaV4 = {
  ...dbSchemaV3,
  entries: "&id, feedId",
  subscriptions: "&id, userId, feedId",
}
