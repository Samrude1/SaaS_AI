# Päivitysohje: Koodimuutoksesta pilvijulkaisuun

Kun teet muutoksia projektin koodiin (frontend tai backend), seuraa tätä työnkulkua viedäksesi muutokset AWS-pilveen.

## 1. Tee koodimuutokset
Esimerkiksi vaihda `system_prompt` tiedostossa `api/server.py` tai muokkaa UI-tekstejä `pages/product.tsx`.

## 2. Varmista ympäristömuuttujat
Varmista, että PowerShell-istunnossasi on `.env`-tiedoston tiedot ladattuna:
```powershell
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^#=]+)=(.+)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        [System.Environment]::SetEnvironmentVariable($name, $value)
    }
}
```

## 3. Rakenna uusi Docker-kuva
Tämä vaihe kääntää frontendin uudelleen ja paketoi sen backendin kanssa.
**Tärkeää:** Käytä aina `--platform linux/amd64` -lippua.

```powershell
docker build `
  --platform linux/amd64 `
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$env:NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY `
  -t medinotes-pro .
```

## 4. Tägää ja Työnnä (Push) AWS-rekisteriin
Tämä lähettää vain muuttuneet osat (layerit) pilveen, joten se on yleensä nopeampaa kuin ensimmäinen kerta.

```powershell
# Tägää
docker tag medinotes-pro:latest "$env:AWS_ACCOUNT_ID.dkr.ecr.$env:DEFAULT_AWS_REGION.amazonaws.com/medinotes-testi:latest"

# Push
docker push "$env:AWS_ACCOUNT_ID.dkr.ecr.$env:DEFAULT_AWS_REGION.amazonaws.com/medinotes-testi:latest"
```

## 5. Aktivoi päivitys AWS App Runnerissa
1. Kirjaudu [AWS-konsoliin](https://console.aws.amazon.com/apprunner).
2. Valitse palvelusi `medinotes-pro-service`.
3. Klikkaa **Deploy**.

AWS hakee uusimman version ECR:stä ja päivittää palvelun. Vanha versio pysyy käynnissä, kunnes uusi on valmis (Zero-downtime deployment).

---

### Pro-vinkki: Automaattinen päivitys
Jos haluat, että päivitys tapahtuu automaattisesti aina kun teet `docker push` -komennon:
1. Mene App Runner -konsoliin.
2. Valitse **Configuration** -> **Configure source**.
3. Muuta "Deployment trigger" tilaan **Automatic**.
*(Huom: Tämä saattaa lisätä hieman kustannuksia, koska AWS valvoo rekisteriä jatkuvasti).*
