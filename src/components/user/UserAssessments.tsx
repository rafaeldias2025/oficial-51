import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Plus, BarChart3 } from "lucide-react";

export function UserAssessments() {
  // Funções auxiliares para o fluxo dinâmico de avaliação
  function handleOptionClick(tipo: string) {
    setShowOptions(false);
    setModalTipo(tipo);
    setShowModal(true);
    setCurso("");
    setPerguntas([{ texto: "", tipo: tipoPadrao(tipo), opcoes: [""], escalaMin: 1, escalaMax: 5 }]);
    setCertificado(false);
    setDataInicio("");
    setDataFim("");
    setObrigatoria(false);
    setTempoLimite("");
  }

  function handleAddPergunta() {
    setPerguntas([...perguntas, { texto: "", tipo: modalTipo ? tipoPadrao(modalTipo) : "multipla", opcoes: [""], escalaMin: 1, escalaMax: 5 }]);
  }
  function handleRemovePergunta(idx: number) {
    setPerguntas(perguntas.filter((_, i) => i !== idx));
  }
  function handlePerguntaChange(idx: number, campo: string, valor: any) {
    setPerguntas(perguntas.map((p, i) => i === idx ? { ...p, [campo]: valor } : p));
  }
  function handleOpcaoChange(idx: number, opIdx: number, valor: string) {
    setPerguntas(perguntas.map((p, i) => i === idx ? { ...p, opcoes: p.opcoes.map((o, oi) => oi === opIdx ? valor : o) } : p));
  }
  function handleAddOpcao(idx: number) {
    setPerguntas(perguntas.map((p, i) => i === idx ? { ...p, opcoes: [...p.opcoes, ""] } : p));
  }
  function handleRemoveOpcao(idx: number, opIdx: number) {
    setPerguntas(perguntas.map((p, i) => i === idx ? { ...p, opcoes: p.opcoes.filter((_, oi) => oi !== opIdx) } : p));
  }
  function handleSalvar() {
    setShowModal(false);
    // Aqui você pode salvar os dados no backend
  }
  function handleCancelar() {
    setShowModal(false);
  }
  const [showOptions, setShowOptions] = React.useState(false);
  const buttonRef = React.useRef(null);
  const dropdownRef = React.useRef(null);

  // Fecha o dropdown ao clicar fora
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(event.target as Node) &&
        buttonRef.current &&
        !(buttonRef.current as any).contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    }
    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptions]);

const [showModal, setShowModal] = React.useState(false);
const [modalTipo, setModalTipo] = React.useState<string | null>(null);
const [curso, setCurso] = React.useState("");
const [perguntas, setPerguntas] = React.useState([
  { texto: "", tipo: "multipla", opcoes: [""], escalaMin: 1, escalaMax: 5 }
]);
const [certificado, setCertificado] = React.useState(false);
const [dataInicio, setDataInicio] = React.useState("");
const [dataFim, setDataFim] = React.useState("");
const [obrigatoria, setObrigatoria] = React.useState(false);
const [tempoLimite, setTempoLimite] = React.useState("");

// Novo estado para modal de prova
function tipoPadrao(tipo: string | null) {
  if (tipo === "Múltipla Escolha") return "multipla";
  if (tipo === "Escala") return "escala";
  if (tipo === "Texto") return "texto";
  if (tipo === "Mista") return "multipla";
  return "multipla";
}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Avaliação de Autocuidado
            </CardTitle>
            <CardDescription>
              Avalie seus hábitos de autocuidado e bem-estar
            </CardDescription>
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Avaliações</h1>
          <p className="text-muted-foreground">
            Gerencie e visualize suas avaliações de desenvolvimento
          </p>
        </div>
        <div className="relative">
          <Button onClick={() => setShowOptions((v) => !v)} ref={buttonRef}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Avaliação
          </Button>
          {showOptions && (
            <div ref={dropdownRef} className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
              <div className="py-1">
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => handleOptionClick('Múltipla Escolha')}>Múltipla Escolha</button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => handleOptionClick('Escala')}>Escala</button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => handleOptionClick('Texto')}>Texto</button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100" onClick={() => handleOptionClick('Mista')}>Mista</button>
              </div>
            </div>
          )}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
                <h2 className="text-xl font-bold mb-4">Criar Avaliação ({modalTipo})</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Curso</label>
                  <input className="border rounded px-2 py-1 w-full" value={curso} onChange={e => setCurso(e.target.value)} placeholder="Selecione ou digite o curso" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Perguntas</label>
                  {perguntas.map((p, idx) => (
                    <div key={idx} className="border rounded p-2 mb-2 bg-gray-50">
                      <div className="flex gap-2 mb-2">
                        <input className="border rounded px-2 py-1 flex-1" value={p.texto} onChange={e => handlePerguntaChange(idx, 'texto', e.target.value)} placeholder={`Pergunta ${idx+1}`} />
                        <select className="border rounded px-2 py-1" value={p.tipo} onChange={e => handlePerguntaChange(idx, 'tipo', e.target.value)}>
                          <option value="multipla">Múltipla Escolha</option>
                          <option value="escala">Escala</option>
                          <option value="texto">Texto</option>
                        </select>
                        <button className="text-red-500 px-2" onClick={() => handleRemovePergunta(idx)} title="Remover pergunta">✕</button>
                      </div>
                      {p.tipo === 'multipla' && (
                        <div className="ml-4 mb-2">
                          <label className="block text-xs mb-1">Opções</label>
                          {p.opcoes.map((op, opIdx) => (
                            <div key={opIdx} className="flex gap-2 mb-1">
                              <input className="border rounded px-2 py-1 flex-1" value={op} onChange={e => handleOpcaoChange(idx, opIdx, e.target.value)} placeholder={`Opção ${opIdx+1}`} />
                              <button className="text-red-500 px-2" onClick={() => handleRemoveOpcao(idx, opIdx)} title="Remover opção">✕</button>
                            </div>
                          ))}
                          <button className="text-xs text-blue-600" onClick={() => handleAddOpcao(idx)}>Adicionar opção</button>
                        </div>
                      )}
                      {p.tipo === 'escala' && (
                        <div className="ml-4 mb-2 flex gap-2 items-center">
                          <label className="text-xs">De</label>
                          <input type="number" className="border rounded px-2 py-1 w-16" value={p.escalaMin} onChange={e => handlePerguntaChange(idx, 'escalaMin', Number(e.target.value))} />
                          <label className="text-xs">até</label>
                          <input type="number" className="border rounded px-2 py-1 w-16" value={p.escalaMax} onChange={e => handlePerguntaChange(idx, 'escalaMax', Number(e.target.value))} />
                        </div>
                      )}
                    </div>
                  ))}
                  <button className="text-xs text-blue-600 mt-2" onClick={handleAddPergunta}>Adicionar pergunta</button>
                </div>
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Data de início</label>
                    <input type="date" className="border rounded px-2 py-1 w-full" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Data de fim</label>
                    <input type="date" className="border rounded px-2 py-1 w-full" value={dataFim} onChange={e => setDataFim(e.target.value)} />
                  </div>
                </div>
                <div className="mb-4 flex gap-4 items-center">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={obrigatoria} onChange={e => setObrigatoria(e.target.checked)} /> Obrigatória
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={!!tempoLimite} onChange={e => setTempoLimite(e.target.checked ? "30" : "")}/> Tempo limite
                    {tempoLimite && (
                      <input type="number" className="border rounded px-2 py-1 w-16" value={tempoLimite} onChange={e => setTempoLimite(e.target.value)} placeholder="min" />
                    )}
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={certificado} onChange={e => setCertificado(e.target.checked)} /> Certificado no final
                  </label>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={handleCancelar}>Cancelar</Button>
                  <Button onClick={handleSalvar}>Salvar Avaliação</Button>
                </div>
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={handleCancelar} title="Fechar">✕</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Avaliação de Autocuidado
            </CardTitle>
            <CardDescription>
              Avalie seus hábitos de autocuidado e bem-estar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Última realização: Nunca
              </p>
              <Button variant="outline" className="w-full">
                Iniciar Avaliação
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Questionário de Bem-estar
            </CardTitle>
            <CardDescription>
              Avaliação geral de satisfação e qualidade de vida
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Última realização: Nunca
              </p>
              <Button variant="outline" className="w-full">
                Iniciar Avaliação
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Avaliação de Metas
            </CardTitle>
            <CardDescription>
              Acompanhe o progresso em suas metas pessoais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Última realização: Nunca
              </p>
              <Button variant="outline" className="w-full">
                Iniciar Avaliação
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Avaliações</CardTitle>
          <CardDescription>
            Suas avaliações anteriores e resultados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <ClipboardList className="mx-auto h-12 w-12 mb-4" />
            <p>Nenhuma avaliação realizada ainda</p>
            <p className="text-sm">Inicie sua primeira avaliação acima</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
    </div>
  );
          <CardHeader>
