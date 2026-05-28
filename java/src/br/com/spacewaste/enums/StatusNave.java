package br.com.spacewaste.enums;

public enum StatusNave {
    DISPONIVEL("Disponível"),
    EM_MISSAO("Em Missão"),
    RETORNANDO("Retornando à Base"),
    MANUTENCAO("Em Manutenção"),
    DESATIVADA("Desativada");

    private final String descricao;

    StatusNave(String descricao) {
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
