
data <- matrix(c(orgpower$owned_images, orgpower$editable_images, orgpower$viewable_images),
               nrow=3,
               ncol=8,
               byrow=TRUE)
data

colnames(data) <- orgpower$X_id
barplot(
  data,
  beside=FALSE,
  xlab = "Extant Organizations",
  ylab = "Permission Total",
  legend = c("OWN", "EDIT", "VIEW")
)
box()

