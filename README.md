Automatizovani Testovi

Ovaj zadatak demonstrira veštine u pisanju automatskih testova koristeći JavaScript/Playwright. Iako je prvobitno korišćen Selenium, zbog specifičnih potreba projekta implementacija je prebačena u Playwright kako bi se iskoristile njegove prednosti za određene scenarije. Pored UI testova, implementirani su i API testovi pisani u Playwrightu, koji pokrivaju iste funkcionalnosti i omogućavaju brže izvršavanje putem API-ja.

Scenariji za pokrivanje:

Pretraga: 
Kategorija "Odeća | Ženska", grupa "Bluze", cena od 100 din, samo sa cenom, stanje "Novo" i "Kao novo (ne korišćeno)" treba da vrati više od 1000 rezultata.

Adresar: 
Pri dodavanju oglasa u Adresar, mora se pojaviti forma za login.

Uputstvo za pokretanje:
Testovi se automatski pokreću na svakom push ili pull request na grane main i master putem GitHub Actions.

Poslednji uspešni test report može se naći u projektu, u sekciji Actions.

Tehnologije:

JavaScript (Playwright) za UI i API testove,
GitHub Actions za CI/CD automatizaciju
