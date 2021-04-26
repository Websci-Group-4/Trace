<!DOCTYPE html>
<html lang="en" class="h-100">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="author" content="Jacob Dyer, Quadir Russell, Ethan Whitton, Deepti Sachi, and Kenny Lee">
    <title>Trace</title>

    <!-- Non-Bootstrap CSS -->
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
  </head>
  <body>
    <?php?>
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <a class="navbar-brand" href="../homepage/homepage.component.html">Trace</a>
        <!-- For mobile users. -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <!-- The navigation bar in general. -->
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item"><a class="nav-link" href="../about/about.component.html">About Us</a></li>
            <li class="nav-item"><a class="nav-link" href="https://github.com/Websci-Group-4/Trace">Github</a></li>
          </ul>
          <!-- NOTE: Should only be shown when not logged in! -->
          <ul class="ml-auto my-auto">
            <button class="btn btn-secondary"><a class="text-light" href="/signin">Sign in</a></button>
            <button class="btn btn-secondary"><a class="text-light" href="/register">Register</a></button>
          </ul>
        </div>
      </div>
    </nav>
  </body>
</html>
