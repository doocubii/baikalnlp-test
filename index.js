let {LanguageServiceClient, Tagger, CustomDict}  = require("bareun");
let host="localhost"; //gpu2.baikal.ai";

async function testLanguageService() {
    console.log("\n\ntestLanguageService()")
    let language_service_client = new LanguageServiceClient(host);

    console.log(">>>>>>> "+ language_service_client.remote + " test start.");


    language_service_client.AnalyzeSyntax("아버지가 방에 들어가신다.",
        (error, res) => {
            console.log('result : language_service_client.AnalyzeSyntax("아버지가 방에 들어가신다.")');
            if( error ) {            
                throw error;            
                return;
            }                 
            console.log(JSON.stringify(res));        
        }
    );

    
    try {  
        let res = await language_service_client.asyncAnalyzeSyntax("아버지가 방에 들어가신다.")
        console.log('result : language_service_client.asyncAnalyzeSyntax("아버지가 방에 들어가신다.")');
        console.log(JSON.stringify(res));    
    } catch(e) {
        console.log(e);       
    } 




}


async function testTagger() {
    console.log("\n\ntestTagger()")
    let tagger = new Tagger(host);
    
    let tagged = await tagger.tag("미친 세상에서 맨정신으로 산다는 건 힘든 일이다.");
    console.log('result : tagger.tag("미친 세상에서 맨정신으로 산다는 건 힘든 일이다.")');
    await (async () => {
 
        const t=true, f=false;
        let obj;
        obj = tagged.pos(t, t, t);
       
        console.log("pos(t, t, t)"+JSON.stringify(obj));
        
        obj = tagged.pos(t, t, f);
        
        console.log("pos(t, t, f)"+JSON.stringify(obj));

        obj = tagged.pos(t, f, t);
        
        console.log("pos(t, f, t)"+JSON.stringify(obj));

        obj = tagged.pos(f, t, t);
        
        console.log("pos(f, t, t)"+JSON.stringify(obj));
        
    })(); 
    

    console.log("\n")
    await (async () => {

        obj = tagged.morphs();

        console.log("morphs()"+JSON.stringify(obj));

        obj = tagged.nouns();

        console.log("nouns()"+JSON.stringify(obj));

        obj = tagged.verbs();

        console.log("verbs()"+JSON.stringify(obj));

    })();


}

async function test(title, fn ) {
    console.log(title + " start.");
    await fn();
}

async function testCustomDict() {

    console.log("\n\ntestCustomDict()")
    let dict = new CustomDict("game", host);
    

    await test("update test", async () =>{
       
        let set = new Set(["지지", "캐리", "던전", "현피", "세계관", "만렙","어그로","치트키","퀘스트","본캐","로밍","방사","딜러","버스","사플" ] );
        dict.copy_cp_set(set);

        let success = await dict.update();
        console.log("result :  dict.update() - " + success);
        await dict.load();
        console.log("result :  dict.load() - " + JSON.stringify(dict.word_sets.cp_set));
    })



    await test("read np set from file", async () => {        
        await dict.read_np_set_from_file(__dirname + "/game_dict.txt");
        console.log("result :  dict.load() - " + JSON.stringify([...dict.word_sets.np_set]));   
        let success = await dict.update();
        console.log("result :  dict.update() - " + success);     
    });

    await test("load test ", async () => {
        
        await dict.load();
        console.log("result :  dict.load() - " + JSON.stringify([...dict.word_sets.np_set]));
    });


    await test("get list custom domains", async () => {
        
        let res = await dict.client.async_get_list();
        console.log("async_get_list() : " + JSON.stringify(res, null, 2));
        
    })

    await test("clear", async () => {
       
        let res = await dict.clear();
        console.log("clear() : " + JSON.stringify(res, null, 2));
        
    })
}

async function main() {
    await testLanguageService();
    await testTagger();
    await testCustomDict();
}

main();