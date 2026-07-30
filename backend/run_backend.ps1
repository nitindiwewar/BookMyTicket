$m2 = "C:\Users\HP\.m2\repository"
$jars = Get-ChildItem -Recurse $m2 -Filter '*.jar' | Where-Object { $_.Name -notlike '*-sources.jar' -and $_.Name -notlike '*-javadoc.jar' } | Select-Object -ExpandProperty DirectoryName | Select-Object -Unique
$cp = "target/classes;" + (($jars | ForEach-Object { "$_\*" }) -join ';')

Set-Content -Path "cp_args.txt" -Value "-cp`n$cp`ncom.movieticket.MovieTicketApplication"
java "@cp_args.txt"
