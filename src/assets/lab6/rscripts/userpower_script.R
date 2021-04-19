
data <- table(
  names = userpower$X_id,
  totals = userpower$total_permissions
)
data

count <- c(userpower$total_permissions)
count

barplot(
  data,
  xlab="Total Permissions",
  ylab="Number of Users"
)
box()

