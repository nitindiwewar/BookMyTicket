$jars = Get-ChildItem -Recurse 'C:\Users\HP\.m2\repository' -Filter '*.jar' | Where-Object { $_.Name -notlike '*-sources.jar' -and $_.Name -notlike '*-javadoc.jar' } | Select-Object -ExpandProperty FullName
$cp = "target/classes;" + ($jars -join ';')
$javaFiles = Get-ChildItem -Recurse 'src/main/java' -Filter '*.java' | Select-Object -ExpandProperty FullName

$args = @("-sourcepath", "src/main/java", "-cp", $cp, "-d", "target/classes") + $javaFiles
Set-Content -Path "javac_args.txt" -Value $args
javac "@javac_args.txt"
