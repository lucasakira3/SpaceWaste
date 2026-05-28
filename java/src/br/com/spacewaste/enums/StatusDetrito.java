package br.com.spacewaste.enums;

public enum StatusDetrito {
    FLUTUANDO("Flutuando"),
    EM_COLETA("Em Coleta"),
    COLETADO("Coletado"),
    REAPROVEITADO("Reaproveitado"),
    CARBONIZADO("Carbonizado");

    private final String descricao;

    StatusDetrito(String descricao) {
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
