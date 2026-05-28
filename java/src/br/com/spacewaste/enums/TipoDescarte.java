package br.com.spacewaste.enums;

public enum TipoDescarte {
    REAPROVEITAMENTO("Reaproveitamento na Terra"),
    CARBONIZACAO("Carbonização Orbital"),
    INDEFINIDO("Indefinido");

    private final String descricao;

    TipoDescarte(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }

    @Override
    public String toString() {
        return descricao;
    }
}
