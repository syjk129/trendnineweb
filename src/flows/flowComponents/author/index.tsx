import * as React from "react";
import TimeAgo from "react-timeago";

import { Person } from "../../../api/models";
import { LinkButton } from "../../../components/button";
import Image from "../../../components/image";
import TextContent from "../../../components/textContent";

import "./style.scss";

interface AuthorProps {
    author: Person;
    date?: Date;
}

export default function Author({ author, date }: AuthorProps) {
    return (
        <div className="author">
            <LinkButton to={`/user/${author.username}`}>
                <Image className="author-image" inline circle src={author.profile_image_url} />
                <TextContent className="author-name">
                    {author.username}
                </TextContent>
            </LinkButton>
            {date && <TimeAgo date={date} />}
        </div>
    );
}
