function queryPdfResource(id: number) {
    console.log(`./resources/pdf/${id + 1}.pdf`);
    return `./resources/pdf/${id + 1}.pdf`;
}

export { queryPdfResource };
