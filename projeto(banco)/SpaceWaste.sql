CREATE TABLE ObjetoEspacial (
    id INT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    altitudeKm DECIMAL(10, 2) NOT NULL,
    inclinacaoGraus DECIMAL(5, 2) NOT NULL,
    longitudeGraus DECIMAL(5, 2) NOT NULL
);

CREATE TABLE EstacaoBase (
    id INT PRIMARY KEY,
    localizacao VARCHAR(100) NOT NULL,
    capacidadeArmazenagemKg DECIMAL(10, 2) NOT NULL,
    cargaAtualKg DECIMAL(10, 2) DEFAULT 0.0,
    FOREIGN KEY (id) REFERENCES ObjetoEspacial(id) ON DELETE CASCADE
);

CREATE TABLE SpaceTruck (
    id INT PRIMARY KEY,
    capacidadeMaxKg DECIMAL(10, 2) NOT NULL,
    cargaAtualKg DECIMAL(10, 2) DEFAULT 0.0,
    combustivelPercent DECIMAL(5, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'DISPONIVEL',
    FOREIGN KEY (id) REFERENCES ObjetoEspacial(id) ON DELETE CASCADE
);

CREATE TABLE Tripulante (
    id INT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    experienciaAnos INT DEFAULT 0,
    id_space_truck INT,
    FOREIGN KEY (id_space_truck) REFERENCES SpaceTruck(id) ON DELETE SET NULL
);

CREATE TABLE Missao (
    id INT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'PLANEJADA',
    dataInicio VARCHAR(15) DEFAULT '--/--/----',
    dataFim VARCHAR(15) DEFAULT '--/--/----',
    id_space_truck INT NOT NULL,
    id_estacao_destino INT NOT NULL,
    FOREIGN KEY (id_space_truck) REFERENCES SpaceTruck(id),
    FOREIGN KEY (id_estacao_destino) REFERENCES EstacaoBase(id)
);

CREATE TABLE PontoOrbital (
    id INT PRIMARY KEY,
    altitudeKm DECIMAL(10, 2) NOT NULL,
    inclinacaoGraus DECIMAL(5, 2) NOT NULL,
    longitudeGraus DECIMAL(5, 2) NOT NULL,
    referencia VARCHAR(150),
    id_missao INT NOT NULL,
    FOREIGN KEY (id_missao) REFERENCES Missao(id) ON DELETE CASCADE
);

CREATE TABLE Detrito (
    id INT PRIMARY KEY,
    tipoDetrito VARCHAR(50) NOT NULL,
    massaKg DECIMAL(10, 2) NOT NULL,
    velocidadeKms DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'FLUTUANDO',
    tipoDescarte VARCHAR(30) DEFAULT 'INDEFINIDO',
    id_missao INT,
    id_estacao_base INT,
    FOREIGN KEY (id) REFERENCES ObjetoEspacial(id) ON DELETE CASCADE,
    FOREIGN KEY (id_missao) REFERENCES Missao(id) ON DELETE SET NULL,
    FOREIGN KEY (id_estacao_base) REFERENCES EstacaoBase(id) ON DELETE SET NULL
);
