import { Handlebars, ViewEngine, ViewEngineOptions } from "./deps.ts";

export class HandlebarsEngine extends ViewEngine {
  constructor(options: Partial<ViewEngineOptions>) {
    super(Handlebars, options);
  }

  async registerPartial(partial: string): Promise<void> {
    const filePath = `${this.partialPath}/${partial}${this.options.extName}`;
    const res = await this.fetch(filePath);
    const templateFile = await res.text();
    this.engine.registerPartial(partial, templateFile);
  }

  async view(
    template: string,
    data: Record<string, unknown>,
    options: Partial<ViewEngineOptions> = {},
  ): Promise<string> {
    options = { ...this.options, ...options };

    const filePath = `${this.viewPath}/${template}${this.options.extName}`;
    const res = await this.fetch(filePath);
    const templateFile = await res.text();
    const pageTmpl = await this.engine.compile(templateFile);
    const content = pageTmpl(data);

    if (options.layout) {
      const filePath =
        `${this.layoutPath}/${options.layout}${this.options.extName}`;
      const res = await this.fetch(filePath);
      const layoutFile = await res.text();
      const layoutTmpl = await this.engine.compile(layoutFile);
      return layoutTmpl({ ...data, content });
    }

    return content;
  }

  async partial(
    template: string,
    data: Record<string, unknown>,
    options: Partial<ViewEngineOptions> = {},
  ): Promise<string> {
    options = {
      rootPath: ".",
      viewPath: "views",
      partialPath: "partials",
      layoutPath: "layouts",
      extName: ".hbs",
      layout: "layout",
      ...options,
    };

    if (!this.engine.partials[template]) {
      await this.registerPartial(template);
    }

    const pageTmpl = await this.engine.compile('{{> "' + template + '"}}');
    return pageTmpl(data);
  }
}
